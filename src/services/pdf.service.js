const PDFDocument = require('pdfkit')

const generatePDF = (deliveryNote) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument()
        const buffers = []

        doc.on('data', (chunk) => buffers.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(buffers)))
        doc.on('error', reject)

        doc.fontSize(20).text('Albarán', { align: 'center' })
        doc.moveDown()
        doc.fontSize(12).text(`ID: ${deliveryNote._id}`)
        doc.text(`Fecha de trabajo: ${new Date(deliveryNote.workDate).toLocaleDateString('es-ES')}`)
        doc.text(`Formato: ${deliveryNote.format}`)
        doc.text(`Descripción: ${deliveryNote.description || '-'}`)
        doc.moveDown()

        if (deliveryNote.format === 'material') {
            doc.text(`Material: ${deliveryNote.material || '-'}`)
            doc.text(`Cantidad: ${deliveryNote.quantity || '-'}`)
            doc.text(`Unidad: ${deliveryNote.unit || '-'}`)
        }

        if (deliveryNote.format === 'hours') {
            doc.text(`Horas: ${deliveryNote.hours || '-'}`)
            if (deliveryNote.workers && deliveryNote.workers.length > 0) {
                doc.moveDown()
                doc.text('Trabajadores:')
                deliveryNote.workers.forEach((w) => {
                    doc.text(`  - ${w.name}: ${w.hours} horas`)
                })
            }
        }

        doc.moveDown()
        doc.text(`Firmado: ${deliveryNote.signed ? 'Sí' : 'No'}`)
        if (deliveryNote.signedAt) {
            doc.text(`Fecha de firma: ${new Date(deliveryNote.signedAt).toLocaleDateString('es-ES')}`)
        }

        doc.end()
    })
}

module.exports = { generatePDF }