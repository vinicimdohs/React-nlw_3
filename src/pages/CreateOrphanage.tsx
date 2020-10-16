import React, { FormEvent, useState,ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent} from 'leaflet';
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";




export default function CreateOrphanage() {
  
  const history = useHistory();
  const[position,setPosition] = useState({latitude:0,longitude:0})

  const [name,setName] = useState('')
  const [about,setAbout] = useState('')
  const [instruction,setInstruction] = useState('')
  const [opening_hours,setOpeningHours] = useState('')
  const [open_on_weekends,setOpenOnWeekends] = useState(true)
  const [images,setImages] = useState<File[]>([]);
  const [previewImages,setPreviewImages] = useState<string[]>([])

  function handleMapClick(e:LeafletMouseEvent){
    const {lat,lng}= e.latlng;

    setPosition({
      latitude:lat,
      longitude:lng
    });
  }

  function handleSelectImages(e:ChangeEvent<HTMLInputElement>){

    if(!e.target.files){
      return;
    }
    const selectedImages = Array.from(e.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image =>{
      return URL.createObjectURL(image);
    })

    setPreviewImages(selectedImagesPreview);
  }

async function handleSubmit(e:FormEvent){
  e.preventDefault();

  const {latitude,longitude} = position;

  const data = new FormData();

  data.append('name',name);
  data.append('latitude',String(latitude));
  data.append('longitude',String(longitude));
  data.append('about',about);
  data.append('instruction',instruction);
  data.append('opening_hours',opening_hours);
  data.append('open_on_weekends',String(open_on_weekends));
  images.forEach(image=>{
    data.append('images',image);
  })

  console.log(name,latitude,longitude,about,instruction,opening_hours,open_on_weekends,images);
  await api.post('orphanages',data);

  alert('Cadastro realizado com sucesso');

  history.push('/app');
}

  return (
    <div id="page-create-orphanage">
        <Sidebar/>
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-27.2092052,-49.6401092]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
              />
                {position.latitude !== 0 
                ? <Marker interactive={false} icon={mapIcon} position={[position.latitude,position.longitude]} /> 
                :  null }
              
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} 
              onChange={e=> setName(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" 
              maxLength={300} 
              value={about} 
              onChange={e=> setAbout(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                  {previewImages.map(image=>{
                    return (
                      <img key={image} src={image} alt={name} />
                    )
                  })}

                <label 
                  htmlFor="image[]"
                  className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" 
              value={instruction} 
              onChange={e=> setInstruction(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">horario disponivel</label>
              <input id="opening_hours" 
              value={opening_hours} 
              onChange={e=> setOpeningHours(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">

                <button type="button" 
                className={open_on_weekends ? 'active' : ''}
                onClick = {()=> setOpenOnWeekends(true)}
                >Sim</button>

                <button 
                type="button"
                className={!open_on_weekends ? 'active' : ''}
                onClick = {()=> setOpenOnWeekends(false)}
                >Não</button>

              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
