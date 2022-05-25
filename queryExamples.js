import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'error', 'warn'] });

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});

async function main() {
  await prisma.role.deleteMany();
  await prisma.kingdom.deleteMany();
  await prisma.person.deleteMany();

  const kingRole = await prisma.role.create({ data: { name: 'king' } });
  const knightRole = await prisma.role.create({ data: { name: 'knight' } });
  const wizardRole = await prisma.role.create({ data: { name: 'wizard' } });

  const logre = await prisma.kingdom.create({ data: { name: 'Logre' } });
  const caledonie = await prisma.kingdom.create({
    data: { name: 'Caledonie' },
  });
  const carmelide = await prisma.kingdom.create({
    data: { name: 'Carmelide' },
  });
  const vanne = await prisma.kingdom.create({ data: { name: 'Vanne' } });
  const galles = await prisma.kingdom.create({ data: { name: 'Galles' } });
  const aquitaine = await prisma.kingdom.create({
    data: { name: 'Aquitaine' },
  });

  await prisma.person.createMany({
    data: [
      {
        firstname: 'Arthur',
        lastname: 'Pendragon',
        age: 35,
        kingdomId: logre.id,
        roleId: kingRole.id,
      },
      {
        firstname: 'Guenièvre',
        age: 30,
        kingdomId: carmelide.id,
      },
      {
        firstname: 'Merlin',
        age: 850,
        roleId: wizardRole.id,
      },
      {
        firstname: 'Perceval',
        age: 36,
        roleId: knightRole.id,
        kingdomId: galles.id,
      },

      {
        firstname: 'Caradoc',
        age: 32,
        roleId: knightRole.id,
        kingdomId: vanne.id,
      },
      {
        firstname: 'Calogrenant',
        age: 44,
        roleId: kingRole.id,
        kingdomId: caledonie.id,
      },
      {
        firstname: 'Leodagan',
        age: 47,
        roleId: kingRole.id,
        kingdomId: carmelide.id,
      },
      {
        firstname: 'Lancelot',
        lastname: 'Du Lac',
        age: 33,
        roleId: knightRole.id,
      },
      {
        firstname: 'Elias',
        lastname: 'De Kelliwich',
        age: 52,
        roleId: wizardRole.id,
      },
      {
        firstname: 'Mevanwi',
        lastname: '',
        age: 28,
        kingdomId: vanne.id,
      },
      {
        firstname: 'Yvain',
        lastname: '',
        age: 23,
        roleId: knightRole.id,
        kingdomId: carmelide.id,
      },
    ],
  });

  //Ecrire la requête qui permet d'afficher Le prénom, nom et âge des personnages

  console.log(
    await prisma.person.findMany({
      select: { firstname: true, lastname: true, age: true },
    })
  );

  // Ecrire la requête qui permet d'afficher
  // Le prénom, nom des personnages ainsi que leur royaume, uniquement pour ceux étant reliés à un royaume

  console.log(
    await prisma.person.findMany({
      select: { firstname: true, lastname: true, age: true, kingdom: true },
      where: { kingdomId: { not: null } },
    })
  );

  //  Ecrire la requête qui permet d'afficher La même chose en incluant tous les personnages
  console.log(
    await prisma.person.findMany({
      select: { firstname: true, lastname: true, age: true, kingdom: true },
    })
  );

  // Ecrire la requête qui permet d'afficher La moyenne de l'âge des personnages

  console.log(
    await prisma.person.aggregate({
      _avg: { age: true },
    })
  );

  // La moyenne est un peu haute non ?
  // Ecrire la requête qui permet d'afficher la moyenne de tous les personnages n’ayant pas le rôle de magicien
  console.log(
    await prisma.person.aggregate({
      _avg: { age: true },
      where: { roleId: { not: wizardRole.id } },
    })
  );

  // Ecrire la requête qui permet d'afficher Le nombre de personnage par royaume (inclure les royaumes n’ayant pas de personnage)

  console.log(
    await prisma.person.groupBy({
      by: ['kingdomId'],
      _count: { _all: true },
    })
  );

  // Ecrire la requête qui permet d'afficher La moyenne de l’âge par rôle

  console.log(
    await prisma.person.groupBy({
      by: ['roleId'],
      _avg: { age: true },
    })
  );

  console.log(
    await prisma.$queryRaw`SELECT r.name, avg(p.age) FROM Person p LEFT JOIN Role r ON r.id = p.roleId   GROUP BY p.roleId`
  );

  // Ecrire la requête qui permet d'afficher La liste de tous les personnages avec leur rôle et royaume éventuels

  console.log(
    await prisma.person.findMany({
      include: {
        kingdom: true,
        role: true,
      },
    })
  );

  // Ecrire la requête qui permet d'afficher La liste des royaumes ayant au moins 2 sujets

  console.log(
    await prisma.$queryRaw`SELECT k.name, k.id, count(p.kingdomId) FROM Person p LEFT JOIN Kingdom k ON k.id = p.kingdomId  GROUP BY p.kingdomId HAVING count(p.kingdomId) >= 2`
  );

  console.log(
    await prisma.person.groupBy({
      by: ['kingdomId'],
      having: {
        kingdomId: {
          _count: { gte: 2 },
        },
      },
      _count: true,
    })
  );
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
