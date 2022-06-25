// import required from 'vuelidate'
import {
  required
} from 'vuelidate/lib/validators'
import axios from 'axios'
export default {
  components: {},
  data() {
    return {
      email: null,
      password: null,
      check: false,
      loginData: null,
      emailError: '',
      passError: '',
      loginResponse: null,
      invalidEmail:null
    }
  },

  methods: {
    logIn() {
      try {
        axios.post('https://web.marsworkers.com/auth/login', {
          "email": this.email,
          "password": this.password

        }).then((response) => {
          this.loginData = response.data
          this.loginResponse = response
          console.log(response, "checkksss")
          this.invalidEmail = this.loginData.error
          console.log(this.invalidEmail, "checkksss")

          if (response) {
            localStorage.setItem('user_token', this.loginData?.access_token)
            localStorage.user_name = this.loginData?.user?.name
            localStorage.user_role = this.loginData?.user?.role_name
          }

          if (localStorage.getItem('user_token') != undefined && this.email != null && this.password != null && !this.invalidEmail) {
            console.log('heree')
            this.$router.push('/investors')
          }

          this.emailError = this.loginData?.email[0],
            this.passError = this.loginData?.password[0]
          console.log(this.emailError, this.passError,this.invalidEmail, "errorss")
          // localStorage.user_token =  this.loginData.access_token


        })


      } catch (e) {
        alert('not authorized')
        console.log(e, this.loginResponse, "error")
      }

    }
  },

  mounted() {
    if (localStorage.getItem('user_token') != undefined && this.email != null && this.password != null && !this.invalidEmail) {
      this.$router.push('/investors')
    }
  }
}
