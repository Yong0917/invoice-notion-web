import type { Invoice } from '@/types/invoice'
import { InvoiceHeader } from './InvoiceHeader'
import { InvoiceItemsTable } from './InvoiceItemsTable'
import { InvoiceSummary } from './InvoiceSummary'
import { PDFDownloadButton } from './PDFDownloadButton'

type InvoiceViewProps = {
  invoice: Invoice
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 print:py-0">
      <div className="flex justify-end print:hidden">
        <PDFDownloadButton invoiceId={invoice.id} invoiceNumber={invoice.invoice_number} />
      </div>
      <InvoiceHeader invoice={invoice} />
      <InvoiceItemsTable items={invoice.items} totalAmount={invoice.total_amount} />
      <InvoiceSummary totalAmount={invoice.total_amount} />
    </div>
  )
}
