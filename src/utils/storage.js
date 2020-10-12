
export function save_user_to_storage(user){
    localStorage.setItem("user",JSON.stringify(user))
}

export function delete_user_from_storage(){
    localStorage.removeItem("user")
}