const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Verificar se já existe usuário admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@desaincorporacoes.com.br' }
  });

  if (!existingAdmin) {
    // Criar usuário administrador padrão
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@desaincorporacoes.com.br',
        name: 'Administrador de Sá',
        phone: '(11) 99999-9999',
        password: bcrypt.hashSync('admin123', 10),
        type: 'admin',
        active: true,
      },
    });

    console.log('✅ Usuário administrador criado:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      type: adminUser.type,
    });
  } else {
    console.log('ℹ️ Usuário administrador já existe');
  }

  // Verificar se já existe propriedade
  const existingProperty = await prisma.property.findFirst({
    where: { name: 'Residencial Lisboa' }
  });

  if (!existingProperty) {
    // Criar propriedade Residencial Lisboa
    const property = await prisma.property.create({
      data: {
        name: 'Residencial Lisboa',
        size: 85,
        available: true,
        category: 'apartamento',
      },
    });

    console.log('✅ Propriedade criada:', {
      id: property.id,
      name: property.name,
      size: property.size,
      category: property.category,
    });

    // Criar endereço para a propriedade
    const address = await prisma.address.create({
      data: {
        cep: '01234-567',
        state: 'SP',
        city: 'São Paulo',
        district: 'Vila Madalena',
        street: 'Rua Lisboa',
        number: '123',
        complement: 'Edifício Residencial Lisboa',
        property_id: property.id,
      },
    });

    console.log('✅ Endereço criado:', {
      id: address.id,
      street: address.street,
      number: address.number,
      city: address.city,
      state: address.state,
    });
  } else {
    console.log('ℹ️ Propriedade Residencial Lisboa já existe');
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });