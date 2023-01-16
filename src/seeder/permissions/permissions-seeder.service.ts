import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { permissionsData } from './permissions.data';
import { Permission } from '../../modules/role/entities/permission.entity';
import { CreatePermissionDto } from '../../modules/role/dto/create-permission.dto';

@Injectable()
export class PermissionsSeederService {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  create(): Array<Promise<Permission>> {
    return permissionsData.map(async (role: CreatePermissionDto) => {
      return await this.repository
        .findOne({ where: { name: role.name } })
        .then(async (dbRole) => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbRole) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            // or create(language).then(() => { ... });
            await this.repository.save(role),
          );
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
