import { GridItem, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";


function PhotoUpload(props) {
    const [edit, setEdit] = useState(false);
    const [img, setImg] = useState('');
    const {t} = useTranslation();

    const upload = function(event) {
        event.preventDefault();
        setEdit(true);
    }

    const saveImg = async function(event) {
        setImg(event.target.files[0]);
        let fd = new FormData()
        fd.append('file', event.target.files[0])
        props.imageUpdate(fd)
        props.photoUpdate(event.target.files[0].name);
    }

    if(edit){
    return(
        <GridItem colSpan={1}>
            <Button
                type="submit"
                mt={8}
                loadingText="Submitting"
                size="lg"
                bg={'white'}
                color={'#774BCD'}
                _hover={{
                    bg: '#C7A1FE',
                }}>
                <input type='file' onChange={saveImg}></input>
            </Button>
        </GridItem>
    )
    } else {
        return(
            <GridItem colSpan={1}>
                <Button
                    mt={8}
                    loadingText="Submitting"
                    size="lg"
                    bg={'white'}
                    color={'#774BCD'}
                    _hover={{
                        bg: '#C7A1FE',
                    }} onClick={upload}>
                    {t('upload-photo')}
                </Button>
            </GridItem>
        )
    }
}
    export default PhotoUpload;