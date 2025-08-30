import React from 'react'
import {View, Image} from 'react-native'

const ImageWrapper = ({imagePath, maxWidth, maxHeight, maxborderRadius, mode}:any) => {
  return (
    <View  style={{width:maxWidth, height:maxHeight, borderRadius:maxborderRadius}}>
        <Image
            style={{width:"100%", height:"100%", borderRadius:maxborderRadius}}
            source={imagePath}
            resizeMode={mode}
        />
    </View>
    
  )
}

export default ImageWrapper
