import React from 'react';

const FirebaseContext = React.createContext(null);

// higher-order component
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);

export const withFirebaseAndRef = Component => (
    React.forwardRef((props, ref) =>
        <FirebaseContext.Consumer>
            {firebase => <Component {...props} firebase={firebase} ref={ref} />}
        </FirebaseContext.Consumer>
    )
);

export default FirebaseContext;