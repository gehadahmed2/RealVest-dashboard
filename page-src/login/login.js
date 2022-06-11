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
      loginResponse: null
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

          if (response) {
            localStorage.setItem('user_token', this.loginData.access_token)
          }

          if (localStorage.getItem('user_token') && this.email != null && this.password != null) {
            this.$router.push('/investors')
          }

          this.emailError = this.loginData?.email[0],
            this.passError = this.loginData?.password[0]

          console.log(this.emailError, this.passError, "errorss")
          // localStorage.user_token =  this.loginData.access_token

          localStorage.user_name = this.loginData.user.name
          localStorage.user_role = this.loginData.user.role_name
        })


      } catch (e) {
        alert('not authorized')
        console.log(e, this.loginResponse, "error")
      }

    }
  },

  mounted() {
    if (localStorage.getItem('user_token')) {
      this.$router.push('/investors')
    }
  }
}
