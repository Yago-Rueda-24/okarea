import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { PhotosModule } from './photos/photos.module';
import { EventsModule } from './events/events.module';
import { PlacesModule } from './places/places.module';
import { VisitsModule } from './visits/visits.module';
import { ChatModule } from './chat/chat.module';

import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { Photo } from './photos/entities/photo.entity';
import { Event } from './events/entities/event.entity';
import { Place } from './places/entities/place.entity';
import { Visit } from './visits/entities/visit.entity';
import { ChatSession } from './chat/entities/chat-session.entity';
import { ChatMessage } from './chat/entities/chat-message.entity';

export const BLOG_ENTITIES = [
  Category,
  Product,
  Photo,
  Event,
  Place,
  Visit,
  ChatSession,
  ChatMessage,
];

@Module({
  imports: [
    CategoriesModule,
    ProductsModule,
    PhotosModule,
    EventsModule,
    PlacesModule,
    VisitsModule,
    ChatModule,
  ],
  exports: [
    CategoriesModule,
    ProductsModule,
    PhotosModule,
    EventsModule,
    PlacesModule,
    VisitsModule,
    ChatModule,
  ],
})
export class BlogModule {}

