const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            isPro: true,
            proUntil: true
        }
    });

    console.log("=== DIAGNÓSTICO DE USUARIOS PRO ===");
    users.forEach(user => {
        console.log(`ID: ${user.id} | Email: ${user.email}`);
        console.log(`Pro: ${user.isPro} | Expiración: ${user.proUntil}`);
        if (user.proUntil) {
            const remaining = Math.ceil((new Date(user.proUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            console.log(`Días calculados: ${remaining}`);
        }
        console.log("-----------------------------------");
    });
}

checkUsers()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
