import axios from 'axios'
export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: "", value: 'image' },
            { text: 'Admin ID', value: 'id' },
            { text: 'Admin name', value: 'name' },
            { text: 'Admin type', value: 'role_name' },
            { text: 'Admin email', value: 'email' },
            { text: 'Access', value: 'permissions', sortable: false },
            { text: 'Actions', value: 'actions', sortable: false },

        ],
        users: [],
        searchData: '',
        selected: [],
        checkbox1: true,
        roles: [],
        permesion: [],
        accessData: null,
        checkbox2: false,
        editedIndex: -1,
        validateInput: false,
        editedItem: {
            id: '',
            name: '',
            role_name: '',
            email: '',
            permissions: [],
            role_id: '',
            current_permssions: [],
            current_role: {}
        },
        defaultItem: {
            id: '',
            name: '',
            role_name: '',
            email: '',
            permissions: [],
            role_id: '',
            current_permssions: [],
            current_role: {}
        },
        edittIconn: [],
        editRole: {},
        emailExist: '',
        nameExist: '',
        persmisionExist: '',
        pagination: {
            current: 1,
            total: 0
          }
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
        changeBtnsTitles() {
            this.formTitle === 'New Item' ? 'Create' : 'Save Changes'
        },
        // findListing() {
        //     return this.users.filter(x => {
        //         return x.name.toLowerCase().includes(this.searchData.toLowerCase())
        //     })
        // }
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    mounted() {
        if (!localStorage.getItem('user_token')) {
            this.$router.push('/')
        }
    },

    created() {
        this.getListing()
        try {
            axios.get('http://34.125.158.199/admin/users/add-admin', {
                headers: {
                    Authorization: `Bearer ${localStorage.user_token}`
                }

            }).then((response) => {
                this.roles = response.data.data.roles
                this.permesion = response.data.data.permissions
                console.log(this.permesion, "this.permesion")
                console.log(this.roles, response, "access")
            })

        } catch (e) {

        }
    },


    methods: {
        onPageChange() {
            this.getListing();
          },
        getListing() {
            try {
                axios.get('https://web.marsworkers.com/admin/users?', {
                    params:{
                      'page': this.pagination.current,
                      'filter': this.searchData 
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.user_token}`
                    }

                }).then((response) => {
                    this.users = response.data.data
                    this.pagination.current = response.data.current_page;
                    this.pagination.total = response.data.last_page;
                    console.log(response, "users")

                })

            } catch (e) {

            }
        },


        async editItem(item) {
            this.editedIndex = this.users.indexOf(item)
            // this.editedItem = Object.assign({}, item)
            // const id = this.users[.indexOf(item)]
            console.log(item, "startttedit")
            try {
                await axios.get(`http://34.125.158.199/admin/users/get-admin/${item.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.user_token}`
                    }

                }).then((response) => {
                    console.log(response, "starttteditres")
                    this.editedItem = Object.assign({}, response.data.data)
                    this.edittIconn = this.editedItem.current_permssions.map(x => x.id)
                    this.editRole = this.editedItem.current_role.id
                    console.log(this.editedItem, "start*****")

                })
            } catch (e) {
                console.log(e)
            }
            // this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.users.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm() {
            const id = this.users.splice(this.editedIndex, 1)
            console.log(id[0].id, "deleteddiddd")
            try {
                await axios.get(`http://34.125.158.199/admin/users/${id[0].id}/delete`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.user_token}`
                    }

                }).then((response) => {
                    console.log(response, "delet")

                })
            } catch (e) {
                console.log(e)
            }
            this.cl
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        changeSelect() {
            console.log(this.selected, this.permissions, this.permesion, "changeee")
        },

        async save() {
            var postData = {
                "email": this.editedItem.email,
                "role_id": this.editRole,
                "permission_ids": this.edittIconn,
                "name": this.editedItem.name,
            };



            if (this.editedIndex > -1) {
                const id = this.users.splice(this.editedIndex, 1)
                console.log(id[0].id, "edit")

                try {
                    await axios.put(`http://34.125.158.199/admin/users/update-admin/${id[0].id}`, postData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.user_token}`
                        }

                    }).then((response) => {
                        Object.assign(this.users[this.editedIndex], response.data.data)
                        this.emailExist = response.data?.email[0]
                        this.nameExist = response.data?.name[0]
                        this.persmisionExist = response.data?.permission_ids[0]
                        console.log(this.emailExist, "this.emailExist")

                    })
                   
                    if (this.emailExist != '') {
                        // alert(this.emailExist)
                        return
                    } else if (this.nameExist != '') {
                        // alert(this.nameExist)
                        return
                    } else {
                        alert()
                        return
                    }
                } catch (e) {
                    console.log(e)
                }
                this.getListing()
                this.close()

            } else {
                if (this.editRole == '' || this.editedItem.email == '' || this.edittIconn == '' || this.editedItem.name == '' && this.emailExist != '' && this.nameExist != '') {
                    alert('Please fill all inputs')
                    return
                }
                try {
                    await axios.post(`http://34.125.158.199/admin/users/create-admin`, postData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.user_token}`
                        }

                    }).then((response) => {
                        console.log(response, "createee")

                    })
                    console.log(this.editItem, "editt")
                } catch (e) {
                    console.log(e)
                }
                this.users.push(this.editedItem)
            }
            this.close()
        },


        // async save() {
        //     var postData = {
        //         "email": this.editedItem.email,
        //         "role_id": this.editedItem.role_id,
        //         "permission_ids": this.editedItem.permissions,
        //         "name": this.editedItem.name,
        //     };
        //     try {
        //         await axios.post(`http://34.125.158.199/admin/users/create-admin`, postData, {
        //             headers: {
        //                 Authorization: `Bearer ${localStorage.user_token}`
        //             }

        //         }).then((response) => {
        //             console.log(response, "createee")

        //         })
        //         console.log(this.editItem, "editt")
        //     } catch (e) {
        //         console.log(e)
        //     }

        //     if (this.editedIndex > -1) {
        //         Object.assign(this.users[this.editedIndex], this.editedItem)
        //     } else {
        //         this.users.push(this.editedItem)
        //     }
        //     this.close()
        // },
    },
}