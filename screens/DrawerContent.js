import React from 'react';
import { View, Text, TouchableOpacity, Alert,DrawerLayoutAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerContent = () => {
    const navigationView = () => (
        <View style={[styles.container, styles.navigationContainer]}>
            <Text style={styles.paragraph}>I'm in the Drawer!</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home', { usuario: usuario })}>
                <Text style={styles.menuText}>Mis datos</Text>
            </TouchableOpacity>
        </View>
    );
    const toggleMenu = () => {
        drawer.current.openDrawer();
    };

    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={210}
            drawerPosition={drawerPosition}
            renderNavigationView={navigationView}>
            <View style={styles.containerDraw}>
                {/* Aquí puedes colocar cualquier contenido que desees en el drawer */}
            </View>
            <View style={styles.container}>
                {/* Aquí colocas el resto de tu contenido */}
                <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                    <Ionicons name="menu" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </DrawerLayoutAndroid>
    );
};

export default DrawerContent;
