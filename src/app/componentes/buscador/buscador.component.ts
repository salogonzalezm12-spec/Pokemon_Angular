import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent {
  nombrePokemon: string = '';
  pokemon: any = null;
  pokemones: any[] = [];
  cargando = false;

  tipoPrincipal: string = '';

  constructor() {
    this.cargarListaInicial();
  }

  async cargarListaInicial() {
    try {
      const respuesta = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=12');
      this.pokemones = respuesta.data.results;
    } catch (error) {
      console.error('Error al cargar la lista de Pokémon:', error);
    }
  }

  async buscarPokemon(nombre?: string) {
    const nombreBusqueda = (nombre || this.nombrePokemon).toLowerCase().trim();
    if (!nombreBusqueda) return;

    this.cargando = true;
    this.pokemon = null;

    try {
 
      const respuesta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nombreBusqueda}`);
      this.pokemon = respuesta.data;


      const tipoIngles = this.pokemon.types[0].type.name;
      this.tipoPrincipal = this.traducirTipo(tipoIngles);


      this.pokemon.abilities = await Promise.all(
        this.pokemon.abilities.map(async (h: any) => {
          const detalle = await axios.get(h.ability.url);
          const nombreEs = detalle.data.names.find((n: any) => n.language.name === 'es');
          return {
            ability: { name: nombreEs ? nombreEs.name : h.ability.name }
          };
        })
      );

    } catch (error) {
      console.error('Error al buscar Pokémon:', error);
      this.pokemon = null;
      this.tipoPrincipal = '';
      alert('Pokémon no encontrado. Intenta con otro nombre.');
    } finally {
      this.cargando = false;
    }
  }

  traducirTipo(tipo: string): string {
    const tipos: any = {
      fire: 'fuego',
      water: 'agua',
      grass: 'planta',
      electric: 'electrico',
      psychic: 'psiquico',
      ice: 'hielo',
      fighting: 'lucha',
      normal: 'normal',
      flying: 'volador',
      bug: 'bicho',
      rock: 'roca',
      ground: 'tierra',
      ghost: 'fantasma',
      dragon: 'dragon',
      dark: 'siniestro',
      steel: 'acero',
      fairy: 'hada',
      poison: 'veneno'
    };
    return tipos[tipo] || tipo;
  }
}