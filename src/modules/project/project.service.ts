import { Injectable } from '@nestjs/common';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDto } from './dto/project.dto';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/project-create.dto';
import { ProjectPageOptionsDto } from './dto/project-page-options.dto';
import { PaginationDto } from '../../common/dtos/page.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import { User } from '../user/entities/user.entity';
import { ProjectUsersDto } from './dto/project-users.dto';
import { UserDto } from '../user/dto/User.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {}

  async pagination(
    pageOptionsDto: ProjectPageOptionsDto,
  ): Promise<PaginationDto<ProjectDto>> {
    const { search, countryId, regionId, cityId } = pageOptionsDto;
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('project')
        .where(`1=1`);
      if (search) {
        queryBuilder.andWhere(`project.name ILIKE '%${search}%'`);
      }
      if (countryId) {
        queryBuilder.andWhere(`project.country_id = :countryId`, {
          countryId: countryId,
        });
      }
      if (regionId) {
        queryBuilder.andWhere(`project.region_id = :regionId`, {
          regionId: regionId,
        });
      }
      if (cityId) {
        queryBuilder.andWhere(`project.city_id = :cityId`, { cityId: cityId });
      }
      const totalCount = await queryBuilder.getCount();
      const items = await queryBuilder
        .orderBy(
          `project.${snakeCase(pageOptionsDto.orderBy)}`,
          pageOptionsDto.order,
        )
        .offset(pageOptionsDto.skip)
        .limit(pageOptionsDto.limit)
        .getMany();
      return new PaginationDto(items, {
        totalCount,
        page: pageOptionsDto.page,
        limit: pageOptionsDto.limit,
      });
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async getAll(): Promise<ProjectDto[]> {
    try {
      return await this.repository.find();
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async create(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<ProjectDto> {
    try {
      const project = new Project();
      project.name = createProjectDto.name;
      project.abbreviation = createProjectDto.abbreviation;
      project.description = createProjectDto.description;
      project.color = createProjectDto.color;
      project.users = [user];
      return await this.repository.save(project);
    } catch (e) {
      if (e.code === '23505') {
        throw new ExceptionType(409, 'Project abbreviation already exists');
      }
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async findOne(projectId: number): Promise<ProjectDto> {
    console.log(projectId);
    try {
      const project = await this.repository.findOne({
        where: { id: projectId },
      });
      if (!project) {
        throw new ExceptionType(404, 'Project not found');
      }
      // console.log(project);
      return project;
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async update(projectId: number, dto: UpdateProjectDto): Promise<ProjectDto> {
    try {
      await this.findOne(projectId);
      await this.repository.update(
        { id: projectId },
        {
          name: dto.name,
          abbreviation: dto.abbreviation,
          description: dto.description,
          color: dto.color
        },
      );
      return await this.findOne(projectId);
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async delete(projectId: number): Promise<DeleteDto> {
    try {
      await this.findOne(projectId);
      await this.repository.softDelete(projectId);
      return { deleted: true };
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async verifyBranch(projectId: number) {
    return await this.repository.findOne({
      where: { id: projectId },
    });
  }

  async setUsers(createOwnerDto: ProjectUsersDto): Promise<ProjectDto> {
    try {
      const project = await this.repository.findOne({
        where: { id: createOwnerDto.projectId },
      });
      project.users = await this.repository.manager.find(User, {
        where: { id: In(createOwnerDto.userIds) },
      });
      return await this.repository.save(project);
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async myProjects(user: User): Promise<ProjectDto[]> {
    return await this.repository.find({
      where: { users: { id: user.id } },
    });
  }

  async getProjectUsers(project: Project): Promise<UserDto[]> {
    const { users } = await this.repository.findOne({
      where: { id: project.id },
      relations: ['users'],
    });
    return users;
  }
}
