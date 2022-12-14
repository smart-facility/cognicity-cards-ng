import { Component, OnInit } from '@angular/core';
import { DeckService } from '../../services/cards/deck.service'

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  rotateDeg: number = 0

  constructor(private deckService: DeckService) {}

  ngOnInit() {
    if (this.isImageSelected)
      this.setImagePreview(this.deckService.getPreview())
  }

  get isImageSelected(): boolean {
    return this.deckService.getPreview() ? true : false
  }

  onFileChanged(event) {
    this.setImagePreview(event.target.files[0])
    this.deckService.setPreview(event.target.files[0] as File)
    // this.deckService.updateSignedUrl(event.target.files[0] as File)
  }

  setImagePreview(file) {
    const reader = new FileReader()
    reader.onload = function (e: any) {
      document.getElementById('image-uploader-picture').setAttribute('src', e.target.result)
    }
    reader.readAsDataURL(file)
  }

  rotateImage() {
    this.rotateDeg += 90
  }

  deletePreview() {
    this.deckService.setPreview(undefined)
  }
}
