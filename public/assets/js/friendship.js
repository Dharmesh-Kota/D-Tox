class Friendship{constructor(e){console.log("Entered the friendship controller!!"),this.friendButton=$(`#${e}`),this.manageFriend()}manageFriend(){$(this.friendButton).click((function(e){e.preventDefault();let n=this;console.log("Default prevented!!"),$.ajax({type:"POST",url:$(n).attr("action")}).done((function(e){"Add"==e.data.task?$(n.friendButton).val("Remove Friend"):$(n.friendButton).val("Add Friend")})).fail((function(e){console.log("Error in completing the like request")}))}))}}