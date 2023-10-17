import React, {useState} from 'react';
import style from "../style/List.module.scss"
import "../style/List.module.scss"
import {Link} from 'react-router-dom'

type PokemonObject = {
    species: string;
    img: string;
    id: number;
    type0: string;
    type1: string;
    attack: number;
  }


function GalleryView(props: {pokemon: PokemonObject[]})  {
    const pokemon = props.pokemon

    const Types : string[]= ['Normal','Fire','Water','Grass','Electric','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy']
    const [selectedTypes, setTypes] = useState(['', ''])
    return (
        <div>
            <div className={style.panel}>
            <ul> 
                {Types.map((type : string) => <li className={ type == selectedTypes[0] || type == selectedTypes[1] ? style.selected : ''} ><a onClick={() => {
                    if (type == selectedTypes[0]) {setTypes(['', selectedTypes[1]])}
                    else if (type == selectedTypes[1]) {setTypes(['', selectedTypes[0]])}
                    else setTypes([selectedTypes[1], type]);}}>{type}</a></li>)}
            </ul>
            </div>

            <div>
            <ul className={style.gallery} >
                {pokemonOrder({pokemon , selectedTypes})}
            </ul>
            </div>
        </div>
    )
}


function pokemonOrder(props: {pokemon : PokemonObject[], selectedTypes : string[]}) {
    const pokemon = props.pokemon;
    const type0 = props.selectedTypes[0].toLowerCase();
    const type1 = props.selectedTypes[1].toLowerCase();
    const list =pokemon.filter((poke : PokemonObject) => 
       ( poke.type0.includes(type1) || poke.type1.includes(type1)) && (poke.type0.includes(type0) || poke.type1.includes(type0))
    );
    if (list.length > 0) 
    return list.map((mon)=> {
        return <Link className={style.invisible} to={{pathname: "/details/" + mon.id}}> <img src={mon.img}/> </Link>
    })

    return <p>A Pokemon with this typing does not exist.</p>

}



export default GalleryView;