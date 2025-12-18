import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador padrão
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@desaincorporacoes.com.br' },
    update: {},
    create: {
      email: 'admin@desaincorporacoes.com.br',
      name: 'Administrador de Sá',
      phone: '(11) 99999-9999',
      password: hashSync('admin123', 10),
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

  // Criar propriedade Residencial Lisboa
  const property = await prisma.property.upsert({
    where: { id: 'residencial-lisboa-default' },
    update: {},
    create: {
      id: 'residencial-lisboa-default',
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
  const address = await prisma.address.upsert({
    where: { property_id: property.id },
    update: {},
    create: {
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