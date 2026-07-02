import type { ReceiptItem, SplitResult } from "@/types";

interface SplitInput {
  items: ReceiptItem[];
  discount: number;
  shipping: number;
  shippingSplit: "equal" | "proportional";
  memberNames: Record<string, string>;
}

export function calculateSplit(input: SplitInput): SplitResult[] {
  const { items, discount, shipping, shippingSplit, memberNames } = input;

  if (items.length === 0) return [];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const memberAmounts = new Map<string, { amount: number; items: { name: string; share: number }[] }>();

  for (const item of items) {
    const itemTotal = item.price * item.quantity - item.discount;
    const participantCount = item.participants.length || 1;
    const perPerson = itemTotal / participantCount;

    for (const participantId of item.participants) {
      if (!memberAmounts.has(participantId)) {
        memberAmounts.set(participantId, { amount: 0, items: [] });
      }
      const entry = memberAmounts.get(participantId)!;
      entry.amount += perPerson;
      entry.items.push({ name: item.name, share: perPerson });
    }
  }

  if (discount > 0 && subtotal > 0) {
    for (const [, entry] of memberAmounts) {
      const ratio = entry.amount / subtotal;
      const discountShare = discount * ratio;
      entry.amount -= discountShare;
    }
  }

  if (shipping > 0) {
    const memberIds = Array.from(memberAmounts.keys());
    if (memberIds.length > 0) {
      if (shippingSplit === "equal") {
        const perMember = shipping / memberIds.length;
        for (const id of memberIds) {
          memberAmounts.get(id)!.amount += perMember;
        }
      } else {
        const totalAfterDiscount = Array.from(memberAmounts.values()).reduce(
          (sum, e) => sum + e.amount,
          0
        );
        for (const [, entry] of memberAmounts) {
          const ratio = totalAfterDiscount > 0 ? entry.amount / totalAfterDiscount : 0;
          entry.amount += shipping * ratio;
        }
      }
    }
  }

  const results: SplitResult[] = [];
  for (const [memberId, entry] of memberAmounts) {
    const rounded = roundToNearest(entry.amount, 500);
    results.push({
      member_id: memberId,
      member_name: memberNames[memberId] || memberId,
      amount: Math.max(0, rounded),
      items: entry.items.map((i) => ({
        name: i.name,
        share: roundToNearest(i.share, 500),
      })),
    });
  }

  const totalRounded = results.reduce((sum, r) => sum + r.amount, 0);
  const targetTotal = roundToNearest(subtotal - discount + shipping, 500);
  const diff = targetTotal - totalRounded;

  if (diff !== 0 && results.length > 0) {
    const largest = results.reduce((max, r) => (r.amount > max.amount ? r : max), results[0]);
    largest.amount += diff;
  }

  return results;
}

function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}

export function getOptimalPayments(splits: SplitResult[]): {
  from: string;
  to: string;
  amount: number;
}[] {
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  const avgAmount = splits.reduce((sum, s) => sum + s.amount, 0) / splits.length;

  for (const split of splits) {
    const diff = split.amount - avgAmount;
    if (diff > 0) {
      creditors.push({ id: split.member_id, amount: diff });
    } else if (diff < 0) {
      debtors.push({ id: split.member_id, amount: -diff });
    }
  }

  const payments: { from: string; to: string; amount: number }[] = [];

  let di = 0;
  let ci = 0;

  while (di < debtors.length && ci < creditors.length) {
    const amount = Math.min(debtors[di].amount, creditors[ci].amount);
    if (amount > 0) {
      payments.push({
        from: debtors[di].id,
        to: creditors[ci].id,
        amount: roundToNearest(amount, 500),
      });
    }

    debtors[di].amount -= amount;
    creditors[ci].amount -= amount;

    if (debtors[di].amount < 1) di++;
    if (creditors[ci].amount < 1) ci++;
  }

  return payments;
}
