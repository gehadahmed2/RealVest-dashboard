import axios from 'axios'

export default {

  data: () => ({

    property_type: null,
    location: null,
    location_map: null,
    unit_price: null,
    Property_desc: null,
    price: null,
    beds: null,
    bath: null,
    floor_number: null,
    area: null,
    land: null,
    built_up_area: null,
    anim: [],
    finishing: {},
    items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
    files: [],
    newFiles: [0],
    readers: [],
    cities: [],
    bedrooms: [],
    bathrooms: [],
    floors: [],
    amenities: [0],
    properties: [],
    finishing_types: [],
    newwimageee: [],
    pushedImages: [],
    afterCreate: '',
    flag:false
  }),
  methods: {
    createListing() {

      var formData = new FormData();
      formData.append("property_type", this.Property_type);
      formData.append("location", this.location);
      formData.append("property_description", this.Property_desc);
      formData.append("price", this.price);
      formData.append("bedrooms", this.beds);
      formData.append("bathrooms", this.bath);
      formData.append("floor_number", this.floor_number);
      formData.append("bathrooms", this.bath);
      formData.append("area", this.area);
      formData.append("land", this.land);
      formData.append("built_up_area", this.built_up_area);
      formData.append("finishing_type", this.finishing);

      for (const i of Object.keys(this.anim)) {
        formData.append('amenities[]', this.anim[i])
      }

      for (const i of Object.keys(this.files)) {
        formData.append('image_ids[]', this.files[i])
      }
      for (const i of Object.keys(this.newFiles)) {
        formData.append('attach[]', this.newFiles[i])
      }


      try {
        axios.post('https://web.marsworkers.com/admin/listings/create-listing', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.user_token}`,
            'Content-Type': 'multipart/form-data'
          }

        }).then((response) => {
          console.log(response, "created success")
          this.afterCreate = response.data
          
        })
        if (this.afterCreate === 'Listing is created Successfuly'){
          this.$router.push('/listing')
        }else{
          this.flag = true
        }
        
      } catch (e) {
       
      }
    },
    addFiles() {
      // console.log('files', this.files)
      this.files.forEach((file, f) => {
        this.readers[f] = new FileReader();
        this.readers[f].onloadend = (e) => {
          let fileData = this.readers[f].result
          let imgRef = this.$refs.file[f]
          imgRef.src = fileData
          // this.files = fileData
          console.log(imgRef, "imgRef ")
          console.log(fileData, "filee")
          // send to server here...
        }
        this.readers[f].readAsDataURL(this.files[f]);
      })
      // this.pushedImages.push(this.files)
      // console.log(this.files,"fileess")

    },


  },

  created() {
    try {
      axios.get('https://web.marsworkers.com/listing/get-create-list', {
        headers: {
          Authorization: `Bearer ${localStorage.user_token}`
        }

      }).then((response) => {
        this.cities = response.data.data.cities
        this.bedrooms = response.data.data.bedrooms
        this.bathrooms = response.data.data.bathrooms
        this.floors = response.data.data.floors
        this.amenities = response.data.data.amenities
        this.properties = response.data.data.properties
        this.finishing_types = response.data.data.finishing_types
        this.anim = this.amenities.map(x => x.code)
        this.finishing = this.finishing_types.type
        console.log(response, "createe")

      })

    } catch (e) {

    }
  },
  mounted() {


    // var fileupload = document.getElementById("FileUpload1");
    // var filePath = document.getElementById("spnFilePath");
    // var image = document.getElementById("imgFileUpload");
    // image.onclick = function () {
    //   fileupload.click();
    // };
    // fileupload.onchange = function () {
    //   var fileName = fileupload.value.split('\\')[fileupload.value.split('\\').length - 1];
    //   filePath.innerHTML = "<b>Selected File: </b>" + fileName;
    // };
  }
}