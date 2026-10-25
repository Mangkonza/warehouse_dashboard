import { prisma } from '../db/prisma.js';

export class EvaluationRepository {
  static async findByCategory(category: string) {
    return prisma.evaluation.findMany({
      where: { category },
    });
  }

  static async findAll() {
    return prisma.evaluation.findMany();
  }

  static async findOne(category: string, recordId: string) {
    return prisma.evaluation.findUnique({
      where: {
        category_recordId: {
          category,
          recordId,
        },
      },
    });
  }

  static async upsert(data: {
    category: string;
    recordId: string;
    sdgIds: number[];
    iType?: string | null;
    journalIndex?: string | null;
    evaluatedBy?: string | null;
  }) {
    return prisma.evaluation.upsert({
      where: {
        category_recordId: {
          category: data.category,
          recordId: data.recordId,
        },
      },
      update: {
        sdgIds: data.sdgIds,
        iType: data.iType || null,
        journalIndex: data.journalIndex || null,
        evaluatedBy: data.evaluatedBy || 'user',
        evaluatedAt: new Date(),
      },
      create: {
        category: data.category,
        recordId: data.recordId,
        sdgIds: data.sdgIds,
        iType: data.iType || null,
        journalIndex: data.journalIndex || null,
        evaluatedBy: data.evaluatedBy || 'user',
        evaluatedAt: new Date(),
      },
    });
  }

  static async bulkUpsert(items: {
    category: string;
    recordId: string;
    sdgIds: number[];
    iType?: string | null;
    journalIndex?: string | null;
    evaluatedBy?: string | null;
  }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.evaluation.upsert({
          where: {
            category_recordId: {
              category: item.category,
              recordId: item.recordId,
            },
          },
          update: {
            sdgIds: item.sdgIds,
            iType: item.iType || null,
            journalIndex: item.journalIndex || null,
            evaluatedBy: item.evaluatedBy || 'bulk',
            evaluatedAt: new Date(),
          },
          create: {
            category: item.category,
            recordId: item.recordId,
            sdgIds: item.sdgIds,
            iType: item.iType || null,
            journalIndex: item.journalIndex || null,
            evaluatedBy: item.evaluatedBy || 'bulk',
            evaluatedAt: new Date(),
          },
        })
      )
    );
  }

  static async delete(category?: string, recordId?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (recordId) where.recordId = recordId;
    return prisma.evaluation.deleteMany({ where });
  }
}
