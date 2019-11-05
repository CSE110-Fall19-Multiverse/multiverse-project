import React, { Component } from 'react';
import {withFirebase} from "./Firebase";

class PostsBase extends Component {
    const ref = this.props.firebase.buying_posts();
    let items;
    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        items = snapshot.val();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

// Wrap PostsBase component in firebase component to use a same firebase agent.
const Posts = withFirebase(PostsBase);
export default Posts;