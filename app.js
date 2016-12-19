new Vue({
	el: '#app',
	data: {
		contacts: {},
		updating: false,
		newContact: null,
		contactSelected: null
	},
	computed:{
		lastID: function(){
			var mayor;
			for(i=0; i<this.contacts.length; i++){
				if(i==0){
					mayor = this.contacts[i].id
				}else{
					if(mayor < this.contacts[i].id){
						mayor = this.contacts[i].id;
					}
				}
			}
			return mayor+1;
		}
	},
	created: function () {
		this.$http.get('https://jsonplaceholder.typicode.com/users')
		.then(function (response){
			this.contacts = response.body.map(function(row){
				return{
					id: row.id,
					nombre: row.name,
					correo: row.email,
					telefono: row.phone,
					paginaweb: row.website,
					empresa: row.company.name,
					publicaciones: []
				}
			});
		});
	},
	methods:{
		save: function(data){
			this.contacts.push(data);
			return true;
		},
		createContact: function(id){
			var data = {
				id: id,
				nombre: this.newContact.nombre,
				correo: this.newContact.correo,
				telefono: this.newContact.telefono,
				paginaweb: this.newContact.paginaweb,
				empresa: this.newContact.empresa,
				publicaciones: []
			}
			if(this.save(data))
				this.newContact = null;
			else{
				alert("Hubo un error");
			}
		},
		readContact: function(data){
			this.contactSelected = data;
			if(this.contactSelected.publicaciones.length <= 0){
				this.$http.get("https://jsonplaceholder.typicode.com/posts"+"?userId="+data.id)
				.then(function (response){
					this.contactSelected.publicaciones = response.body;
				});
			}
		},
		deleteContact: function(index){
			this.contacts.splice(index,1);
		}
	}
})