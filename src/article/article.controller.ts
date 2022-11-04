import {Body, Controller, Delete, Get, Param, Post, UseGuards} from "@nestjs/common";
import {ArticleService} from "./article.service";
import {AuthGuard} from "../user/guards/auth.guard";
import {UserEntity} from "../user/user.entity";
import {User} from "../user/decorators/user.decorator";
import {CreateArticleDto} from "./dto/createArticle.dto";
import {ArticleResponseInterface} from "./types/articleResponse.interface";
import slugify from 'slugify';

@Controller('articles')
export class ArticleController{

    constructor(private readonly articleService: ArticleService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @User() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface>{
        const article = await this.articleService.createArticle(
            currentUser,
            createArticleDto
        );
        return this.articleService.buildArticleResponse(article);
    }

    @Get(':slug')
    async getSingleArticle(
        @Param(':slug') slug: string,): Promise<ArticleResponseInterface>{
        const article = await this.articleService.findBySlug(slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@User('id') currentUserID: number, @Param(':slag') slug: string){
        return await this.articleService.deleteArticle(slug, currentUserID);

    }
}
