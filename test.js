import React from 'react';

const ParentComponent = props => {
    const testFunction = id => {
        console.log(`My Id is ${id}`);
    }

    return (
        <View>
            <ChildComponent 
                action={testFunction}
            />
        </View>
    )
}

const ChildComponent = props => {
    const id = 'someRandomId';

    return (
        <View>
            <TouchableOpacity
                onPress={() => props.action(id)}
            >
                <Text>My Child Component</Text>
            </TouchableOpacity>
        </View>
    )
}