import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { RegistrationInputModel } from '../types/auth-input.models';

@Injectable()
export class AuthCommandRepo {
  constructor(
    private prisma: PrismaService
  ) {}

  async registration(registrationInputModel: RegistrationInputModel){
    await this.prisma.user.create({
        data: {
            email: registrationInputModel.email,
            createdAt: new Date().toISOString(),
            credInfo: {
                create: {
                    passwordHash: 'fsdf',
                    isActivated: false,
                    code: 'dsf',
                    codeExpiresAt: 111,
                }
            },
            tokenInfo: {
                create: {
                    ip: 'dsa',
                    title: 'hfg',
                    deviceId: 'fsd',
                    issuedAt: 44,
                    expiresAt: 44,
                }
            }
        }
    })

    const user = await this.prisma.user.findMany()
    console.log('user', user)
    return 
  }

  async login(){

    return
  }
  
  async logout(){
    
    return
  }

  async refreshToken(){
    
    return
  }

  async passwordRecovery(){
    await this.prisma.user.update({
        where: {
          email: 'email-1@mail.com',
        },
        data: {
          credInfo: {
            update: {
                code: '111'
            }
          }
        },
    })
    return 
  }

  async newPassword(){
    await this.prisma.credInfoUser.updateMany({
        where: {
            code: '111'
        },
        data: {
            passwordHash: '333'
        }
    })
    return 
  }

  async registrationConfirmation() {
    await this.prisma.credInfoUser.updateMany({
        where: {
            code: '111'
        },
        data: {
            passwordHash: '333'
        }
    })
    return 
  }

  async registrationEmailResending(){
    await this.prisma.user.update({
        where: {
          email: 'email-1@mail.com',
        },
        data: {
          credInfo: {
            update: {
                code: '111'
            }
          }
        },
    })
    return 
  }

}
