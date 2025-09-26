import { NgModule } from "@angular/core";
import { ServiceImageComponent } from "../components/service-image/service-image.component";
import { CommonModule } from "@angular/common";
import { Sharedmodule } from "./sharedmodule";

@NgModule({
    declarations : [ServiceImageComponent],
    imports : [CommonModule,Sharedmodule]
})
export class Servicemodule {
    
}
