import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateContactDto, UpdateContactDto, ContactQueryDto } from './contacts.dto.js';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateContactDto) {
    // Get user's default vault
    const vault = await this.prisma.vault.findFirst({
      where: { ownerId: userId },
    });

    if (!vault) {
      throw new NotFoundException('No vault found. Please create a vault first.');
    }

    const contact = await this.prisma.contact.create({
      data: {
        vaultId: dto.vaultId || vault.id,
        ownerId: userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        nickname: dto.nickname,
        photo: dto.photo,
        bio: dto.bio,
        company: dto.company,
        jobTitle: dto.jobTitle,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
        anniversary: dto.anniversary ? new Date(dto.anniversary) : undefined,
        labels: dto.labels || [],
        tags: dto.tags || [],
        socialLinks: dto.socialLinks ? JSON.stringify(dto.socialLinks) : undefined,
        firstMetDate: dto.firstMetDate ? new Date(dto.firstMetDate) : undefined,
        firstMetContext: dto.firstMetContext,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      ...contact,
      socialLinks: contact.socialLinks ? JSON.parse(contact.socialLinks as string) : null,
    };
  }

  async findAll(userId: string, query: ContactQueryDto) {
    const where: any = { ownerId: userId };

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { nickname: { contains: query.search, mode: 'insensitive' } },
        { company: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.label) {
      where.labels = { has: query.label };
    }

    if (query.tag) {
      where.tags = { has: query.tag };
    }

    if (query.vaultId) {
      where.vaultId = query.vaultId;
    }

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip: query.offset || 0,
        take: query.limit || 10,
        orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || 'desc' } : { createdAt: 'desc' },
        include: {
          _count: {
            select: { interactions: true, reminders: true },
          },
        },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      contacts: contacts.map((c) => ({
        ...c,
        socialLinks: c.socialLinks ? JSON.parse(c.socialLinks as string) : null,
      })),
      total,
      offset: query.offset || 0,
      limit: query.limit || 10,
    };
  }

  async findOne(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, ownerId: userId },
      include: {
        interactions: {
          orderBy: { occurredAt: 'desc' },
          take: 10,
        },
        reminders: {
          where: { status: 'pending' },
          orderBy: { scheduledAt: 'asc' },
          take: 5,
        },
        _count: {
          select: { interactions: true, reminders: true, tasks: true, gifts: true },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return {
      ...contact,
      socialLinks: contact.socialLinks ? JSON.parse(contact.socialLinks as string) : null,
    };
  }

  async update(userId: string, contactId: string, dto: UpdateContactDto) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, ownerId: userId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const updateData: any = { ...dto };
    
    if (dto.birthday) {
      updateData.birthday = new Date(dto.birthday);
    }
    if (dto.anniversary) {
      updateData.anniversary = new Date(dto.anniversary);
    }
    if (dto.socialLinks) {
      updateData.socialLinks = JSON.stringify(dto.socialLinks);
    }

    const updated = await this.prisma.contact.update({
      where: { id: contactId },
      data: updateData,
    });

    return {
      ...updated,
      socialLinks: updated.socialLinks ? JSON.parse(updated.socialLinks as string) : null,
    };
  }

  async delete(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, ownerId: userId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.contact.delete({
      where: { id: contactId },
    });

    return { success: true };
  }

  async getLabels(userId: string) {
    const contacts = await this.prisma.contact.findMany({
      where: { ownerId: userId },
      select: { labels: true },
    });

    const labelSet = new Set<string>();
    contacts.forEach((c) => c.labels.forEach((l) => labelSet.add(l)));

    return Array.from(labelSet);
  }

  async getTags(userId: string) {
    const contacts = await this.prisma.contact.findMany({
      where: { ownerId: userId },
      select: { tags: true },
    });

    const tagSet = new Set<string>();
    contacts.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));

    return Array.from(tagSet);
  }
}
