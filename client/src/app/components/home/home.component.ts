import { Component, OnInit } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import {ResponseContentType} from "@angular/http";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  files;
  ipAddress : string="";
  constructor(private http: HttpClient) {

  }

  ngOnInit() {
  }
  downloadFile(filename){
    let name = filename.split('.')[0];
    let extension = filename.split('.')[1];
    let url = 'http://'+this.ipAddress+':9000'+'/download/'+name+"/"+extension;
    console.log("the url is: "+ url)
    this.http.get(url,{
      responseType: "blob"
    }).subscribe(content=>{
        FileSaver.saveAs(content,filename);
      console.log(content)
      console.log("Downloading file")
    },err=>{
      console.log("error downloading file")
    })
  }
    deleteFile(filename)
    {
        let name = filename.split('.')[0];
        let extension = filename.split('.')[1];
        let url = 'http://'+this.ipAddress+':9000'+'/delete/'+name+"/"+extension;
        this.http.get(url).subscribe(content=>{
            this.http.get('http://'+this.ipAddress+':9000').subscribe(content=>{
                this.files = content;
                console.log(content)
            });
        });
    }

     getFiles(){
      if(this.ipAddress.length>0)
      {
          this.http.get('http://'+this.ipAddress+':9000').subscribe(content=>{
              this.files = content;
              console.log(content)
          });
      }
      else {
          alert("Please enter ip address of the node")
      }

    }
}
