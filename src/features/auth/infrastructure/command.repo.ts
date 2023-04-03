import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { User } from '../../types/domain/user.schema';

@Injectable()
export class AuthCommandRepo {
  constructor(private prisma: PrismaService) {}

  async registration(user: User){
    await this.prisma.user.create({
        data: {
            email: user.email,
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

    const users = await this.prisma.user.findMany()
    console.log('user', user)
    return 
  }

  async login(session){

    return
  }
  
  async logout(userId: number, deviceId: string, issuedAt: number){
    
    return
  }

  async refreshToken(session: number, issuedAt: number, expiresAt: number){
    
    return
  }

  async passwordRecovery(email: string, code: string){
    await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          credInfo: {
            update: {
                code: code,
            }
          }
        },
      },
    });
    return;
  }

  async newPassword(passwordHash: string, recoveryCode: string){
    await this.prisma.credInfoUser.updateMany({
        where: {
            code: recoveryCode,
        },
        data: {
            passwordHash: passwordHash,
        }
    })
    return 
  }

  async registrationConfirmation(code: string) {
    await this.prisma.credInfoUser.updateMany({
        where: {
            code: code,
        },
        data: {
            isActivated: true,
        }
    })
    return 
  }

  async registrationEmailResending(email: string, code: string){
    await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          credInfo: {
            update: {
                code: code,
            }
          }
        },
    })
    return 
  }
}
