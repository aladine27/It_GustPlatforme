import {
  Body, Controller, Get, Param, Post, Res,
  HttpStatus, UseGuards
} from '@nestjs/common';
import { ApplicationAnalysisService } from './application-analysis.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Public } from 'src/decorators/public.decorator';

@Controller('application-analysis')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
export class ApplicationAnalysisController {
  constructor(private readonly svc: ApplicationAnalysisService) {}

  @Get(':offerId')
  @UseGuards(RolesGuard)
  @Public()
  async list(@Param('offerId') offerId: string, @Res() res) {
    try {
      const data = await this.svc.listForFront(offerId);
      return res.status(HttpStatus.OK).json({
        message: 'Analyses retrieved successfully',
        data,
        status: HttpStatus.OK,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  // ===== POST run (delta only -> stocke en DB -> renvoie tout le cache) =====
  @Post(':offerId/run')
  @UseGuards(RolesGuard)
   @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        requirements: { type: 'string' },
        allowed_filenames: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['requirements', 'allowed_filenames'],
    },
  })
  async run(
    @Param('offerId') offerId: string,
    @Body() body: { requirements: string; allowed_filenames: string[] },
    @Res() res,
  ) {
    try {
      const data = await this.svc.runAndCacheDelta(offerId, body);
      return res.status(HttpStatus.OK).json({
        message: 'Analyses processed successfully',
        data,
        status: HttpStatus.OK,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
