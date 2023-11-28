import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import "../style/List.module.scss"
import style from "../style/List.module.scss"

type PlantObject = {
    id: Number,
    common_name: String,
    scientific_name: String,
    default_image: any,
  }
  


function ListView(props: {plants: PlantObject[]})  {
    const plants = props.plants

    const [query, setQuery] = useState("");
    const [reverse, setReverse] = useState(false)
    const [sortByAttack, setSortBy] = useState(false) //boolean value because there are only the two options


    return (
        <div className={style.wrapper}>
            <div className={style.box}>
                <div>
            <h3>Search</h3>
            <input className={style.searchBar} type="search" onChange={(event) => {setQuery(event.target.value)}}></input>
            </div>
            
            <label className={style.dropDown}>
                Sort by:   
                <select name="order" onChange={(e)=>setSortBy(e.target.value === "attack")}>
                    <option value="" >Pokedex Entry Number</option>
                    <option value="attack" >Attack Power</option>
                </select>
                
            </label>

            <br></br>
            <label >
            <input type="radio" id="ascending" className={style.radio} checked={!reverse} onChange={() =>setReverse(false)}></input>
            Ascending
            </label>
            <label>
            <input type="radio" className={style.radio} checked={reverse} onChange={() =>setReverse(true)}></input>
            Descending
            </label>
            </div>
            <div className={style.listWrap}>

            <ul>
                {pokemonOrder({pokemon: plants, query, reverse, sortByAttack})}
            </ul>
            </div>
        </div>
    )
}

function pokemonOrder(props: {pokemon : PlantObject[], query: string, reverse: boolean, sortByAttack: boolean}) {
    const pokemon = props.pokemon;
    const list =pokemon.filter((poke : PlantObject) => 
    poke.common_name.includes(props.query) ||
    poke.id === Number(props.query) ||
    poke.scientific_name.includes(props.query));

  
    if (props.reverse) {
        list.reverse();
    }


    return list.map((mon, index)=> {
        return <li key={index}><ListItem pokemon={mon}></ListItem></li>
    })

}

function ListItem(props: {pokemon : PlantObject}) {
    const pokemon = props.pokemon
    return (
        <div className={style.list}>
                {/* <Link className={style.listLink} to={'/mp2/details/' + pokemon.id}> */}
                <h5>{pokemon.common_name}</h5>
                <h3> # {'' + pokemon.id}</h3>
                {/* <p>{pokemon.type0} {pokemon.type1 !== "" ? ', '+ pokemon.type1 : ''}</p> */}
                <p> {pokemon.scientific_name}</p>
                <p> {pokemon.default_image}</p>
                <img src={pokemon.default_image} alt="poemonImage" >

                </img> */
                {/* </Link> */}
            
        </div>

            
    )
}

export default ListView;