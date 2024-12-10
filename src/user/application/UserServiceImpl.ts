import UserService from '../api/service/UserService';
import UserDTO from '../api/dto/UserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../domain/User';
import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserAlreadyExistsException } from '../api/exceptions/exceptions';
import UserField from '../domain/UserField';
import UserFieldMap from '../domain/UserFieldMap';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import UserFieldType from '../domain/UserFieldType';
import * as console from 'node:console';
import UserFieldDTO from '../api/dto/UserFieldDTO';

@Injectable()
export default class UserServiceImpl extends UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserField) private userField: Repository<UserField>,
    @InjectRepository(UserFieldMap)
    private userFieldMap: Repository<UserFieldMap>,
  ) {
    super();
  }

  async createBaseUser(
    userId: string,
    name: string,
  ): Promise<UserDTO> {
    console.log(`Create user with id ${userId}, name : ${name}`);
    //Check if user already exists
    const existingUser = await this.userRepo.findOne({
      where: { userId: userId },
    });
    //Throw exception if user already exists
    if (existingUser) {
      throw new UserAlreadyExistsException(userId);
    }
    //TODO Encrypt password
    const savedUser = await this.userRepo.save({
      userId: userId,
      username: name,
    });
    return this.toDTO(savedUser);
  }

  async getBaseUserById(userId: string): Promise<UserDTO | null> {
    console.log(`Getting user with id ${userId}`);
    const user = await this.userRepo.findOne({
      where: {
        userId: userId,
      },
    });
    return this.toDTO(user);
  }

  async getAllUserFields(userId: string): Promise<UserFieldDTO | null> {
    // Get all mapped fields of user
    const userFieldMaps = await this.userFieldMap.findBy({
      userId: userId,
    });

    //Get all fieldIds
    const fieldIds: string[] = [];

    userFieldMaps.map((value) => fieldIds.push(value.fieldId));
    const fields = await this.userField.find({
      where: {
        fieldId: In(fieldIds),
      },
    });

    // Create a map of fieldId to fieldName for quick lookup
    const fieldNameMap = new Map(
      fields.map((field) => [field.fieldId, field.fieldName]),
    );

    // Construct DTO
    return {
      fields: userFieldMaps.map((userFieldMap) => ({
        fieldId: userFieldMap.fieldId,
        fieldName: fieldNameMap.get(userFieldMap.fieldId),
        fieldValue: userFieldMap.value,
      })),
      userId: userId,
    };
  }

  async updateUser(
    userId: string,
    baseInfo?: {
      username?: string;
    },
    fieldInfo?: Map<string, string>,
  ): Promise<void> {
    if (baseInfo) {
      const updatedInfo: Partial<User> = {
        username: baseInfo.username,
      };
      await this.userRepo.update(userId, updatedInfo);
    }
    if (fieldInfo) {
      //Filter out invalid filedIds by getting all validFields
      let criteria: FindOptionsWhere<UserField>[] = [];
      fieldInfo.forEach((_, key) =>
        criteria.push({
          fieldId: key,
        }),
      );
      const validFields = await this.userField.findBy(criteria);
      //Once we have the list of valid validFields. We can start attempting to add them
      const userFieldMaps: UserFieldMap[] = [];
      validFields.forEach((field) => {
        //Get values
        const fieldVal = fieldInfo.get(field.fieldId);
        //Parse the field type
        const fieldType: UserFieldType = JSON.parse(field.fieldType);
        //Determine if the fieldVal is valid for its type
        if (fieldType.type == 'enum') {
          if (fieldType.options.includes(fieldVal)) {
            userFieldMaps.push({
              fieldId: field.fieldId,
              userId: userId,
              value: fieldVal,
            });
          }
        } else if (fieldType.type == 'int') {
          const numVal = parseInt(fieldVal);
          if (!isNaN(numVal)) {
            userFieldMaps.push({
              userId: userId,
              value: numVal.toString(),
              fieldId: field.fieldId,
            });
          }
        } else if (fieldType.type == 'float') {
          const floatVal = parseFloat(fieldVal);
          if (!isNaN(floatVal)) {
            userFieldMaps.push({
              userId: userId,
              value: floatVal.toString(),
              fieldId: field.fieldId,
            });
          }
        } else if (fieldType.type == 'text') {
          userFieldMaps.push({
            userId: userId,
            value: fieldVal,
            fieldId: field.fieldId,
          });
        }
      });
      await this.userFieldMap.save(userFieldMaps);
    }
  }

  private toDTO(user: User): UserDTO | null {
    if (!user) return null;
    return {
      username: user.username,
      userID: user.userId,
    };
  }

  async getUserFieldValue(
    userId: string,
    fieldIds: string[],
  ): Promise<UserFieldDTO | null> {
    // Find user field maps for specific field IDs
    const userFieldMaps = await this.userFieldMap.find({
      where: {
        fieldId: In(fieldIds),
      },
    });

    // If no field maps found, return null or empty DTO
    if (userFieldMaps.length === 0) {
      return null;
    }

    // Fetch all fields in a single query
    const fields = await this.userField.find({
      where: {
        fieldId: In(userFieldMaps.map((map) => map.fieldId)),
      },
    });

    // Create a map of fieldId to fieldName for quick lookup
    const fieldNameMap = new Map(
      fields.map((field) => [field.fieldId, field.fieldName]),
    );

    // Construct DTO with only the requested field IDs
    return {
      fields: userFieldMaps.map((userFieldMap) => ({
        fieldId: userFieldMap.fieldId,
        fieldName: fieldNameMap.get(userFieldMap.fieldId),
        fieldValue: userFieldMap.value,
      })),
      userId: userId,
    };
  }
}
