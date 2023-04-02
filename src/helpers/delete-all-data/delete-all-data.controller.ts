import {Controller, Delete, HttpCode} from '@nestjs/common';
import {AllDataService} from "./delete-all-data.service";

@Controller('delete-all-data')
export class AllDataController {

    constructor(private allDataService: AllDataService) {}

    @Delete()
    @HttpCode(204)
    async delete(){
       await this.allDataService.deleteAllData()
    }

}