import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { map, publishReplay, refCount, take, tap } from 'rxjs/operators';
import { CodeModel } from '../models/CodeModel';

@Injectable({
  providedIn: 'root'
})
export class CodesService {
  private sharedRep: Observable<CodeModel[]>;
  private codePaths!: Map<string, string[]>;

  constructor(private httpClient: HttpClient) {
    this.sharedRep = this.httpClient.get<CodeModel[]>('codes').pipe(
      map(codes => {
        this.codePaths = new Map();
        // init code paths
        this.processRecursive(codes.filter(t => !!t.codeDisplay && t.isRoot), undefined, (node, parent, depth) => {
          // we have problem sending the parent data into request because of circular dependencies
          // so we recreate the parent stuff
          node.display = node.codeDisplay;
          node.parent = parent;
          node.id = `${node.id}`;
          if (parent) {
            node.groupBy = `${!!parent?.groupBy ? (parent.groupBy + ', ') : ''}${parent.codeDisplay}`;
          }
          if (parent) {
            this.codePaths.set(node.id, Object.assign([], this.codePaths.get(parent.id)));
          } else {
            this.codePaths.set(node.id, [node.id]);
          }
          depth > 0 && this.codePaths.get(node.id)?.push(node.id);
          return !!node.children;
        },
          (node, depth) => node.children!, 0);
        return codes.filter(t => !!t.codeDisplay);
      }),
      publishReplay(1, 5 * 60 * 1000),
      refCount(),
      take(1)
    );
  }

  public getCodes(): Observable<CodeModel[]> {
    return this.sharedRep.pipe(map(items => {
      const agg: CodeModel[] = [];
      items.forEach(it => agg.push({ ...it }));
      return agg;
    }));
  }

  public getTrie(): Observable<Map<string, string[]>> {
    return this.sharedRep.pipe(
      map(_ => new Map(this.codePaths))
    );
  }

  private processRecursive(
    codes: CodeModel[],
    parent: CodeModel | undefined,
    callback: (code: CodeModel, parent: CodeModel | undefined, depth: number) => boolean,
    next: (code: CodeModel, depth: number) => CodeModel[],
    depth: number = 0
  ): boolean {
    var map: any = {};
    codes.forEach((code) => map[code.id] = callback(code, parent, depth));
    codes?.filter(item => map[item.id]).forEach(code =>
      this.processRecursive(
        next(code, depth + 1) || [],
        code,
        callback,
        next,
        depth + 1)
    );
    return true;
  }
}
