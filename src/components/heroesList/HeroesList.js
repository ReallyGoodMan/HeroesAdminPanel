import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import {fetchHeroes, heroDeleted, selectAll} from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { useCallback } from 'react';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const filteredHeroesSelector = createSelector(
        (state) => state.filtersReducer.activeFilter,
        //(state) => state.heroesReducer.heroes,
        selectAll,
        (activeFilter, heroes) => {
            if(activeFilter === 'all') {
                return heroes;
            } else {
                return heroes.filter(item => item.element === activeFilter);
            }
        }
    );

    // const filteredHeroes = useSelector(state => {
    //     if(state.filtersReducer.activeFilter === 'all') {
    //         return state.heroesReducer.heroes;
    //     } else {
    //         return state.heroesReducer.heroes.filter(item => item.element === state.filtersReducer.activeFilter);
    //     }
    // })

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroesReducer.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());      
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(data => console.log(data, 'Deleted'))
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err));
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} onDelete={() => onDelete(id) }/>
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;