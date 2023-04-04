import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { UserDomain } from '../../types/domain/user.schema';
import { CredInfoUser } from '../../types/domain/cred-info-user.schema';

@Injectable()
export class AuthCommandRepo {
  constructor(private prisma: PrismaService) {}

  async registration(user: UserDomain){
    
    await this.prisma.user.create({
        data: {
            email: user.email,
            createdAt: user.createdAt,
            credInfo: {
                create: {
                    passwordHash: user.credInfo.passwordHash,
                    isActivated: user.credInfo.isActivated,
                    code: user.credInfo.code,
                    codeExpiresAt: user.credInfo.codeExpiresAt,
                }
            },
        }
    })
    
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
    })

    return
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
    console.log('code', code)
    const prev = await this.prisma.user.findMany()
    console.log('prev', prev)
    const res = await this.prisma.credInfoUser.updateMany({
        where: {
            code: code,
        },
        data: {
            isActivated: true,
        }
    })
    const after = await this.prisma.user.findMany({
      include: {
        credInfo: true
      }
    })
    console.log('after', after)
    console.log('res', res)
    return res.count
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

  async findUserbyEmail(email: string){
    const foundedUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        credInfo: true
      }
    })
    if(!foundedUser) return null
    const user = new UserDomain({email: foundedUser.email, passwordHash: foundedUser.credInfo.passwordHash}, new CredInfoUser()) 
    user.setAll(foundedUser)
    return user
  }

  async findOne(issuedAt, deviceId, userId){
    return true
  }
}
