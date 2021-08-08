import { takeUntil } from 'rxjs/operators';
import { OfficeServiceService } from '../service/office-service.service';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormOfficer } from '@shared/utils/base-form-officer';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  actionTODO = Action.EDIT;
  showPasswordField = true;
  hide = true;
  
  private subscription: Subscription = new Subscription();

  public districtData: any = [];
  public subdistrictData: any = [];
  public provinceData: any = [];
  constructor(
    private  officerServ: OfficeServiceService,
    private router: Router,
    public officerForm: BaseFormOfficer,
    public activatedRoute: ActivatedRoute
  ) {
    //console.log('extras', this.router.getCurrentNavigation().extras.state.item);
    this.officerForm.baseForm.patchValue(this.router.getCurrentNavigation().extras.state.item);
    this.getProvince();
    setTimeout(() => {
      this.onEditProvince(this.officerForm.baseForm.value.province);
    }, 1500);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // console.log('test');
  }

  ngOnInit(): void {
    this.officerForm.baseForm.get('role').setValidators(null);
    this.officerForm.baseForm.get('role').updateValueAndValidity();
    this.officerForm.baseForm.value.status = 'Yes';
  }

  onUpdate(): void {
    if (this.officerForm.baseForm.invalid) {
      return;
    }
    const formValue = this.officerForm.baseForm.value;
    //console.log(formValue);
    if (this.actionTODO === Action.EDIT)
    {
      this.officerServ.Update(formValue.id, formValue).subscribe((res) => {
        this.officerForm.baseForm.value.status = 'Yes';
          Swal.fire({
            title: 'Success!',
            text: "ดำเนินการเสร็จสิ้น!",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'ตกลง',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['officer/list']);
            }
          })       
      });
    }
  }
  
  getSubDistrict(id): void {
    let postData = {
      district_id : id
    }
    this.officerServ.getSubDistrict(postData).subscribe(resp => {
      this.subdistrictData = resp.data;
      //console.log(this.subdistrictData);
    });
  }

  getDistrict(id): void {
    let postData = {
      province_id : id
    }
    this.officerServ.getDistrict(postData).subscribe(resp => {
      this.districtData = resp.data;
      //console.log(this.districtData);
    });
  }

  getProvince(): void {
    this.officerServ.getProvince().subscribe(resp => {
      this.provinceData = resp.data;
      //console.log(this.provinceData);
    });
  }

  onEditProvince(name): void {
    let namepro = name;
    let list = this.provinceData.filter(x => x.name_th === namepro)[0];
    console.log(list);
    this.getDistrict(list.id);
  }


  changProvince(e): void {
    let namepro = e.target.value;
    let list = this.provinceData.filter(x => x.name_th === namepro)[0];
    console.log(list);
    this.officerForm.baseForm.patchValue({ 
      district : ''
    });
    this.getDistrict(list.id);
  }

  changDistrict(e): void {
    let name = e.target.value;
    let list = this.districtData.filter(x => x.name_th === name)[0];
    console.log(list);
    this.officerForm.baseForm.patchValue({ 
      sub_district : '',
      postal_code : ''
    });
    this.getSubDistrict(list.id);
  }

  
  changSubDistrict(e): void {
    let name = e.target.value;
    let list = this.subdistrictData.filter(x => x.name_th === name)[0];
    console.log(list);
    this.officerForm.baseForm.patchValue({ 
      postal_code : list.zip_code 
    });
  }
}
