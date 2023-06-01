export type StatusUserType = {
    status: 'active' | 'ban'        
    statusReason: string                     
    userId: number       
};
export class UserStatusDomain {
    id: number                
    status: 'active' | 'ban'        
    statusReason: string     
    statusDate: string                  
    userId: number            
    static create(userStatusDto: StatusUserType){
        const userStatus = new UserStatusDomain()
        userStatus.status = userStatusDto.status
        userStatus.statusDate = new Date().toISOString()
        userStatus.statusReason = userStatusDto.statusReason
        userStatus.userId = userStatusDto.userId
        return userStatus
    }
}