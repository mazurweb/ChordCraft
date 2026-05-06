import { PricingTable } from '@/components/marketing/PricingTable';
import { PricingCheckoutButtons } from '@/components/marketing/PricingCheckoutButtons';

export const metadata = { title: 'Pricing — ChordCraft' };

export default function PricingPage() {
  return (
    <>
      <PricingTable />
      <PricingCheckoutButtons />
    </>
  );
}
