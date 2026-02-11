import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const codeToSearch = 'TZHDgX';
    console.log(`--- Buscando QR con código: ${codeToSearch} ---`)
    const qr = await prisma.dynamicQR.findUnique({
        where: { shortCode: codeToSearch }
    })

    if (!qr) {
        console.log(`No se encontró el QR con código: ${codeToSearch}`)

        console.log('\n--- Últimos 10 QRs guardados ---')
        const lastQrs = await prisma.dynamicQR.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        })
        lastQrs.forEach(q => console.log(`[${q.shortCode}] -> ${q.targetUrl}`))
    } else {
        console.log(`ID: ${qr.id}`)
        console.log(`Código: ${qr.shortCode}`)
        console.log(`URL Destino: ${qr.targetUrl}`)
        console.log(`Clicks: ${qr.clicks}`)
        console.log(`Creado: ${qr.createdAt}`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
