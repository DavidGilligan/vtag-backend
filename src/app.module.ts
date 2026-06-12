import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { VtagsModule } from './modules/vtags/vtags.module';
import { OwnershipModule } from './modules/ownership/ownership.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { MileageModule } from './modules/mileage/mileage.module';
import { MotModule } from './modules/mot/mot.module';
import { ServiceRecordsModule } from './modules/service-records/service-records.module';
import { ModificationsModule } from './modules/modifications/modifications.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OcrModule } from './modules/ocr/ocr.module';
import { DocumentAnalysisModule } from './modules/document-analysis/document-analysis.module';
import { RegistrationLookupModule } from './modules/registration-lookup/registration-lookup.module';
import { DvsaMotModule } from './modules/dvsa-mot/dvsa-mot.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    VtagsModule,
    OwnershipModule,
    DocumentsModule,
    TimelineModule,
    MileageModule,
    MotModule,
    ServiceRecordsModule,
    ModificationsModule,
    GalleryModule,
    MarketplaceModule,
    NotificationsModule,
    OcrModule,
    DocumentAnalysisModule,
    RegistrationLookupModule,
    DvsaMotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
