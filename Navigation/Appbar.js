import { Appbar } from 'react-native-paper';

export default function AppBar(){
    const title="Testi"
    
    return(
        <Appbar.Header>
            <Appbar.Content title={"Testi"}/>
        </Appbar.Header>
    )
}