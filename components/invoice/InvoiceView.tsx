import type { Invoice } from '@/types/invoice'
import { InvoiceHeader } from './InvoiceHeader'
import { InvoiceItemsTable } from './InvoiceItemsTable'
import { InvoiceSummary } from './InvoiceSummary'

type InvoiceViewProps = {
  invoice: Invoice
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 print:py-0">
      <InvoiceHeader invoice={invoice} />
      <InvoiceItemsTable items={invoice.items} totalAmount={invoice.total_amount} />
      <InvoiceSummary totalAmount={invoice.total_amount} />
    </div>
  )
}
