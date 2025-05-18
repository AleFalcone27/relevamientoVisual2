import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { supabase } from './supabase.client';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) { }



  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logOut() {
    this.auth.signOut();
    this.router.navigate(['/home']);
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  async getLastVotedImagesByUsers(): Promise<{ user_uid: string; image_url: string }[]> {
    const { data, error } = await supabase.rpc('get_last_voted_images');

    if (error) {
      throw new Error('Error fetching last voted images: ' + error.message);
    }

    return data;
  }

  // async getLastVotedImage(): Promise<{ imageUrl: string; createdAt: string } | null> {
  //   const user = await this.auth.currentUser;
  //   if (!user) throw new Error('No authenticated user');

  //   const { data, error } = await supabase
  //     .from('votos')
  //     .select('image_url, created_at')
  //     .eq('user_id', user.uid)
  //     .order('created_at', { ascending: false })
  //     .limit(1)
  //     .single();

  //   if (error && error.code !== 'PGRST116') {
  //     throw new Error('Error fetching last vote: ' + error.message);
  //   }

  //   if (!data) return null;

  //   return {
  //     imageUrl: data.image_url,
  //     createdAt: data.created_at
  //   };
  // }

  async getVotedImagesByUser(): Promise<string[]> {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('votos')
      .select('image_url')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Error fetching voted images: ' + error.message);
    }

    return data.map(voto => voto.image_url);
  }

  async votarImagen(imageUrl: string): Promise<void> {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase.from('votos').insert({
      user_id: user.uid,
      image_url: imageUrl,
      created_at: new Date().toISOString()
    });

    if (error) {
      throw new Error('Error al insertar el voto: ' + error.message);
    }
  }

  async uploadCosasLindasToSupabase(webPath: string): Promise<string> {
    const user = await this.auth.currentUser;
    if (!user || !user.email) throw new Error('No authenticated user found');

    const response = await fetch(webPath);
    const blob = await response.blob();

    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

    const uniqueId = uuidv4().split('-')[0];
    const fileName = `${user.email}-${timestamp}-${uniqueId}.jpeg`;

    const { error } = await supabase
      .storage
      .from('relevamientovisual')
      .upload(`cosasLindas/${fileName}`, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      throw new Error('Upload failed: ' + error.message);
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('relevamientovisual')
      .getPublicUrl(`cosasLindas/${fileName}`);

    return publicUrlData.publicUrl;
  }

  async uploadCosasFeasToSupabase(webPath: string): Promise<string> {
    const user = await this.auth.currentUser;
    if (!user || !user.email) throw new Error('No authenticated user found');

    const response = await fetch(webPath);
    const blob = await response.blob();

    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

    const uniqueId = uuidv4().split('-')[0];
    const fileName = `${user.email}-${timestamp}-${uniqueId}.jpeg`;

    const { error } = await supabase
      .storage
      .from('relevamientovisual')
      .upload(`cosasFeas/${fileName}`, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      throw new Error('Upload failed: ' + error.message);
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('relevamientovisual')
      .getPublicUrl(`cosasLindas/${fileName}`);

    return publicUrlData.publicUrl;
  }



  async getAllImages(): Promise<string[]> {
    const user = await this.auth.currentUser;
    if (!user || !user.email) throw new Error('No authenticated user');

    console.log('User email:', user.email);

    const { data: lindasData, error: lindasError } = await supabase
      .storage
      .from('relevamientovisual')
      .list('cosasLindas', { limit: 100 });

    if (lindasError) throw new Error('Failed to list cosasLindas images: ' + lindasError.message);

    const { data: feasData, error: feasError } = await supabase
      .storage
      .from('relevamientovisual')
      .list('cosasFeas', { limit: 100 });

    if (feasError) throw new Error('Failed to list cosasFeas: ' + feasError.message);

    console.log('CosasLindas files:', lindasData.map(f => f.name));
    console.log('CosasFeas files:', feasData.map(f => f.name));

    const lindasUrls = lindasData
      .filter(file => file.name.toLowerCase().includes(user.email!.toLowerCase()))
      .map(file =>
        supabase.storage
          .from('relevamientovisual')
          .getPublicUrl(`cosasLindas/${file.name}`).data.publicUrl
      );

    const feasUrls = feasData
      .filter(file => file.name.toLowerCase().includes(user.email!.toLowerCase()))
      .map(file =>
        supabase.storage
          .from('relevamientovisual')
          .getPublicUrl(`cosasFeas/${file.name}`).data.publicUrl
      );

    return [...lindasUrls, ...feasUrls];
  }






  async getCosasFeasImages(): Promise<string[]> {
    const { data, error } = await supabase
      .storage
      .from('relevamientovisual')
      .list('cosasFeas', { limit: 100 });

    if (error) throw new Error('Failed to list images: ' + error.message);

    // Filtrar archivos no deseados y luego invertir el orden
    const filteredData = data
      .filter(file => !file.name.includes('.emptyFolderPlaceholder'))
      .reverse();

    return filteredData.map(file => {
      const publicUrl = supabase.storage
        .from('relevamientovisual')
        .getPublicUrl(`cosasFeas/${file.name}`).data.publicUrl;

      return publicUrl;
    });
  }


  async getCosasLindasImages(): Promise<string[]> {
    const { data, error } = await supabase
      .storage
      .from('relevamientovisual')
      .list('cosasLindas', { limit: 100 });

    if (error) throw new Error('Failed to list images: ' + error.message);

    // Filtrar archivos no deseados
    const filteredData = data
      .filter(file => !file.name.includes('.emptyFolderPlaceholder'))
      .reverse(); // Invertir el orden

    return filteredData.map(file => {
      const publicUrl = supabase.storage
        .from('relevamientovisual')
        .getPublicUrl(`cosasLindas/${file.name}`).data.publicUrl;

      return publicUrl;
    });
  }





  async getImagesForCurrentUser(): Promise<string[]> {
    const user = await this.auth.currentUser;
    const all = await this.getAllImages();
    return all.filter(url => url.includes(user!.email!));
  }

  async getAllImagesFilteredByCosasLindas(): Promise<string[]> {
    // Listar cosasLindas
    const { data: lindasData, error: lindasError } = await supabase
      .storage
      .from('relevamientovisual')
      .list('cosasLindas', { limit: 100 });

    if (lindasError) throw new Error('Failed to list cosasLindas images: ' + lindasError.message);

    // Listar cosasFeas
    const { data: feasData, error: feasError } = await supabase
      .storage
      .from('relevamientovisual')
      .list('cosasFeas', { limit: 100 });

    if (feasError) throw new Error('Failed to list cosasFeas images: ' + feasError.message);

    // Obtener todas las URLs públicas
    const lindasUrls = lindasData.map(file => {
      const { data } = supabase.storage
        .from('relevamientovisual')
        .getPublicUrl(`cosasLindas/${file.name}`);
      return data.publicUrl;
    });

    const feasUrls = feasData.map(file => {
      const { data } = supabase.storage
        .from('relevamientovisual')
        .getPublicUrl(`cosasFeas/${file.name}`);
      return data.publicUrl;
    });

    // Juntar todas las URLs
    const allUrls = [...lindasUrls, ...feasUrls];

    // Filtrar por la palabra 'cosasLindas' en la URL
    return allUrls.filter(url => url.includes('cosasLindas'));
  }

  async getTopVotedImagesLindas(): Promise<{ image_url: string; vote_count: number }[]> {
    const { data, error } = await supabase.rpc('get_top_voted_images');

    if (error) throw new Error('Error fetching top voted images: ' + error.message);

    // Filtramos solo las URLs que contienen 'cosasLindas'
    return data.filter((item: { image_url: string; vote_count: number }) => item.image_url.includes('cosasLindas'));
  }

  async getTopVotedImagesFeas(): Promise<{ image_url: string; vote_count: number }[]> {
    const { data, error } = await supabase.rpc('get_top_voted_images');

    if (error) throw new Error('Error fetching top voted images: ' + error.message);

    // Filtramos solo las URLs que contienen 'cosasLindas'
    return data.filter((item: { image_url: string; vote_count: number }) => item.image_url.includes('cosasFeas'));
  }

}



