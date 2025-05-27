import { EntityInUseError } from '@application/errors/entity-in-use.error';
import { CreateCategoryUseCase } from '@application/usecases/category/create-category.usecase';
import { DeleteCategoryUseCase } from '@application/usecases/category/delete-category.usecase';
import { FindCategoryByIdUseCase } from '@application/usecases/category/find-category-by-id.usecase';
import { FindCategoryContainingNameUseCase } from '@application/usecases/category/find-category-containing-name.usecase';
import { ListCategoriesUseCase } from '@application/usecases/category/list-categories.usecase';
import { UpdateCategoryUseCase } from '@application/usecases/category/update-category.usecase';
import { CreateCategoryDto } from '@infra/dto/create-category.dto';
import { ReturnCategoryDto } from '@infra/dto/return-category.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from '../decoretors/roles.decorator';
import { UserType } from 'src/enums/user-type.enum';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listAllCategoriesUseCase: ListCategoriesUseCase,
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    private readonly findCategoryContainingNameUseCase: FindCategoryContainingNameUseCase,
    private readonly deleteCategoryByIdUseCase: DeleteCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
  ) {}

  @Roles(UserType.User, UserType.Admin)
  @Get()
  async list(): Promise<ReturnCategoryDto[]> {
    return (await this.listAllCategoriesUseCase.execute()).map(
      (category) => new ReturnCategoryDto(category),
    );
  }

  @Roles(UserType.User, UserType.Admin)
  @Get(':id')
  async findById(@Param('id') id: number): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.findCategoryByIdUseCase.execute(Number(id)),
    );
  }

  @Roles(UserType.User, UserType.Admin)
  @Get('byName/:name')
  async findByName(@Param('name') name: string): Promise<ReturnCategoryDto[]> {
    return (await this.findCategoryContainingNameUseCase.execute(name)).map(
      (category) => new ReturnCategoryDto(category),
    );
  }

  @Roles(UserType.Admin)
  @Post()
  async create(@Body() body: CreateCategoryDto): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.createCategoryUseCase.execute(body),
    );
  }

  @Roles(UserType.Admin)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: CreateCategoryDto,
  ): Promise<ReturnCategoryDto> {
    id = Number(id);

    await this.findCategoryByIdUseCase.execute(id);

    return new ReturnCategoryDto(
      await this.updateCategoryUseCase.execute({
        id,
        ...body,
      }),
    );
  }

  @Roles(UserType.Admin)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number): Promise<void> {
    id = Number(id);

    await this.findCategoryByIdUseCase.execute(id);

    try {
      await this.deleteCategoryByIdUseCase.execute(id);
    } catch (err: any) {
      if (err.code === 'P2003') {
        throw new EntityInUseError('categoria');
      }
      console.log(err);
    }
  }
}
