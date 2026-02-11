import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";

@Injectable()
export class ItemsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    const { rows } = await this.db.query(
      'SELECT id, name, created_at AS "createdAt", updated_at AS "updatedAt" FROM items ORDER BY created_at DESC',
    );
    return rows;
  }

  async findOne(id: string) {
    const { rows } = await this.db.query(
      'SELECT id, name, created_at AS "createdAt", updated_at AS "updatedAt" FROM items WHERE id = $1',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Item with id "${id}" not found`);
    }
    return rows[0];
  }

  async create(dto: CreateItemDto) {
    const { rows } = await this.db.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING id, name, created_at AS "createdAt", updated_at AS "updatedAt"',
      [dto.name],
    );
    return rows[0];
  }

  async update(id: string, dto: UpdateItemDto) {
    const sets: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (dto.name !== undefined) {
      sets.push(`name = $${idx++}`);
      params.push(dto.name);
    }

    if (sets.length === 0) {
      return this.findOne(id);
    }

    sets.push(`updated_at = now()`);
    params.push(id);

    const { rows } = await this.db.query(
      `UPDATE items SET ${sets.join(", ")} WHERE id = $${idx} RETURNING id, name, created_at AS "createdAt", updated_at AS "updatedAt"`,
      params,
    );
    if (!rows[0]) {
      throw new NotFoundException(`Item with id "${id}" not found`);
    }
    return rows[0];
  }

  async remove(id: string) {
    const { rows } = await this.db.query(
      'DELETE FROM items WHERE id = $1 RETURNING id, name, created_at AS "createdAt", updated_at AS "updatedAt"',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Item with id "${id}" not found`);
    }
    return rows[0];
  }
}
