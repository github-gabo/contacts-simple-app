//Transitions:
Vue.transition('msjfade', {
	enterClass: 'fadeIn',
	leaveClass: 'fadeOut'
});
Vue.transition('displaying', {
	enterClass: 'flipInX',
	leaveClass: 'flipOutX'
});
Vue.transition('details', {
	enterClass: 'fadeIn',
	leaveClass: 'fadeOut'
});
//Model data
var myModel = {
	messagePrimary: "Directorio Telefónico",
	contacts: {},
};
//Component
Vue.component("list-contacts",{
	template: '#listContacts',
	data: function(){
		return {
			newContact: null,
			searchString: "",
			contactSelected: null,
			showMsjFade: false,
			showContactSelected: false
		}
	},
	props: ["contacts","posts","data_item","filter"],
	ready: function(){
		this.showMsjFade = true;
		this.showContactSelected = false;
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
			if(this.save(data)){
				this.newContact = null;
				$("#myModal").modal("toggle");
			}else{
				alert("Hubo un error");
			}
		},
		readContact: function(data){
			this.contactSelected = data;
			
			this.showMsjFade = false;
			this.showContactSelected = true;

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
		},
		filteredContacts: function(){
			var contacts_array = this.contacts,
                searchString = this.searchString;
            if(!searchString){
                return contacts_array;
            }
            searchString = searchString.trim().toLowerCase();
            contacts_array = contacts_array.filter(function(item){
                if(item.nombre.toLowerCase().indexOf(searchString) !== -1){
                    return item;
                }
            })
            return contacts_array;
		}
	}
});
//Vue Instance
var vm = new Vue({
	el: '#app',
	data: myModel,
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
		resetNewContact: function(){
			this.newContact = null;
		}
	}
});
$("#myModal").on("hidden.bs.modal", function () {
	vm.resetNewContact();
});