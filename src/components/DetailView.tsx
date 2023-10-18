import React from 'react';
import "../style/List.module.scss"
import style from "../style/List.module.scss"
import {useParams, useNavigate} from 'react-router-dom'

type PokemonObject = {
    species: string;
    img: string;
    id: number;
    type0: string;
    type1: string;
    attack: number;
  }


function DetailView(props: {pokemon: PokemonObject[]})  {
    const {id}  = useParams();
    const navigate = useNavigate();
    const pokemon = props.pokemon

    return (
        <div>
            <div className={style.arrows}>

                <button onClick={() =>{ navigate('/mp2/details/' + ((Number(id) + 647) % 649 + 1)  ) }}>{'<<<'}</button>
                <button onClick={() =>{ navigate('/mp2/details/' + ((Number(id)) % 649 + 1))}}>{'>>>'}</button>
            </div>
            <img src={pokemon[Number(id) - 1].img} alt="Pokemon">
            </img>

            <div className={style.details}>
                <h3>#{pokemon[Number(id) - 1].id}: {pokemon[Number(id) - 1].species}</h3>
                <p>{pokemon[Number(id) - 1].type0} {pokemon[Number(id) - 1].type1 !== "" ? ', '+ pokemon[Number(id) - 1].type1 : ''}</p>
                <p>Attack Power: {pokemon[Number(id) - 1].attack}</p>
            </div>
            
            
        </div>
    )
}





export default DetailView;